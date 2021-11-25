
class CalculationHandler {
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
        body.a = body.a0 + body.ad * t;
        body.e = body.e0 + body.ed * t;
        body.i = this.deg2rad(body.i0 + body.id * t);
        body.ml = this.deg2rad(body.ml0 + body.mld * t);
        body.lp = this.deg2rad(body.lp0 + body.lpd * t);
        body.o = this.deg2rad(body.o0 + body.od * t);
    }

    static getHelioXYZR(body) {
        var horizons = body.params.horizons
        var x = this.a * (Math.cos(horizons.OM) * Math.cos(body.LP) - Math.sin(horizons.OM) * Math.cos(horizons.IN) * Math.sin(body.LP));
        var y = this.a * (Math.sin(horizons.OM) * Math.cos(body.LP) + Math.cos(horizons.OM) * Math.cos(horizons.IN) * Math.sin(body.LP));
        var z = this.a * (Math.sin(horizons.IN) * Math.sin(body.LP));
        var r = Math.sqrt(x * x + y * y + z * z);
        return { x: x, y: y, z: z, r: r };
    }
}