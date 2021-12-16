export class CalculationHandler {
    static solveKepler(e, M) {
        var threshold = this.deg2rad(1e-6);
        var dE;
        var E = M + e * Math.sin(M)
        do {
            dE = (M - E) / (1 - e * Math.cos(E));
            E = E + dE;
        } while (Math.abs(dE) > threshold);
        return E;
    }

    static toNormalRange(angle) {
        var n = Math.floor(angle / 2 / Math.PI);
        var result = angle - n * 2 * Math.PI;
        if (result > Math.PI) {
            result = result - 2 * Math.PI;
        }
        return result;
    }

    static deg2rad(deg) {
        return deg * Math.PI / 180;
    }

    static rad2deg(rad) {
        return rad * 180 / Math.PI;
    }

    static getTEph(utcMillis) {
        return utcMillis / 86400000 + 2440587.5;
    }

    static updateMeanElements(utcMillis, body) {
        var tEph = this.getTEph(utcMillis);
        var t = (tEph - 2451545) / 36525;
        const horizons = body.params.horizons
        horizons.A = horizons.A0 + horizons.AD * t;
        horizons.E = horizons.E0 + horizons.ED * t;
        horizons.I = this.deg2rad(horizons.I0 + horizons.ID * t);
        horizons.ML = this.deg2rad(horizons.ML0 + horizons.MLD * t);
        horizons.LP = this.deg2rad(horizons.LP0 + horizons.LPD * t);
        horizons.O = this.deg2rad(horizons.O0 + horizons.OD * t);
    }

    static getHelioXYZR(body) {
        const horizons = body.params.horizons
        var omega = horizons.LP - horizons.O;
        var M = this.toNormalRange(horizons.ML - horizons.LP);
        var E = this.solveKepler(horizons.E, M);
        var x = horizons.A * (Math.cos(E) - horizons.E);
        var y = horizons.A * Math.sqrt(1 - horizons.E * horizons.E) * Math.sin(E);
        var xEcl = (Math.cos(omega) * Math.cos(horizons.O) - Math.sin(omega) * Math.sin(horizons.O) * Math.cos(horizons.I)) * x + (-Math.sin(omega) * Math.cos(horizons.O) - Math.cos(omega) * Math.sin(horizons.O) * Math.cos(horizons.I)) * y;
        var yEcl = (Math.cos(omega) * Math.sin(horizons.O) + Math.sin(omega) * Math.cos(horizons.O) * Math.cos(horizons.I)) * x + (-Math.sin(omega) * Math.sin(horizons.O) + Math.cos(omega) * Math.cos(horizons.O) * Math.cos(horizons.I)) * y;
        var zEcl = Math.sin(omega) * Math.sin(horizons.I) * x + Math.cos(omega) * Math.sin(horizons.I) * y;
        return {
            x: xEcl,
            y: yEcl,
            z: zEcl,
            r: Math.sqrt(x * x + y * y)
        };
    }

    static kmToAU(km) {
        return km / Astronomy.KM_PER_AU;
    }

    static mToAU(m) {
        return this.kmToAU(m / 1000);
    }
}

export class OdeIntegrationHandler {
    // Class to handle ODE integration methods, adapted from Prof. Pister's code:
    // https://piazza.com/class/kss3lmq0yqm3ih?cid=28

    static mu = 1.327e20 / 1e9 // mu in km^3/s^2
    static AU = 1.496e11 / 1e3 // AU in km
    static beta = 0.15

    constructor() {
        this.sim = math.parser();

        // Define everything beforehand
        this.sim.evaluate("G = 6.67408e-11 m^3 kg^-1 s^-2")  // Gravitational constant
        this.sim.evaluate("mbody = 5.9724e24 kg")            // Mass of Sum
        this.sim.evaluate("mu = G * mbody")                  // Standard gravitational parameter
        this.sim.evaluate("AUkm = 1.496e11 / 1e3")           // Astronomical unit
        this.sim.evaluate("beta = 0.15")                     // Drag coefficient
        this.sim.evaluate("r0 = 6378.137e3 m")               // Radius of Sun

        // Define functions
        function ndsolve(f, x0, dt, tmax, args=[]) {
            let x = x0.clone()  // Current values of variables
            const result = [x]  // Contains entire solution
            const nsteps = math.divide(tmax, dt)   // Number of time steps
            for (let i = 0; i < nsteps; i++) {
              // Compute derivatives
              const dxdt = f.map(func => func(x.toArray(), ...args.toArray()))
              // Euler method to compute next time step
              const dx = math.multiply(dxdt.toArray(), dt)
              x = math.add(x, dx[0])
              result.push(x)
            }
            return math.matrix(result)
        }

        // Solve ODE `dx/dt = f(x,t), x(0) = x0` numerically.
        function Fsail(s, coneAngle) {
            var rSquared = math.pow(s[0], 2) + math.pow(s[1], 2);
            var rCubed = math.pow(rSquared, 1.5);
            var aSunX = -OdeIntegrationHandler.mu * s[0] / rCubed;
            var aSunY = -OdeIntegrationHandler.mu * s[1] / rCubed;
            //var aSunZ = -OdeIntegrationHandler.mu * s[2] / rCubed;
            var theta = math.atan2(s[1], s[0]);
            //var thetaZ = math.atan2(s[2], s[0]);
            var aSail = OdeIntegrationHandler.beta * OdeIntegrationHandler.mu / rSquared * math.cos(coneAngle)**2;
            var aSailX = aSail*math.cos(theta+coneAngle);
            var aSailY = aSail*math.sin(theta+coneAngle);
            //var aSailZ = aSail*math.sin(thetaZ+coneAngle); // Might be cos, will see
            return [s[3], s[4], s[5], aSunX+aSailX, aSunY+aSailY, 0];
        }

        math.import({ndsolve, Fsail})
    }

    getSailPos(coneAngle) {
        // Returns the position of the solar sail at the given initial position and cone angle
        this.sim.evaluate("TMP_curConeAngle = " + coneAngle);
        const result = this.sim.evaluate("ndsolve([Fsail], [AUkm, 0, 0, 0, 30, 0], 1e6, 6e7, [TMP_curConeAngle])")
        return result.toArray();
    }
}

export const odeHandler = new OdeIntegrationHandler();
