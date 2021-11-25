
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
}
