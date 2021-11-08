//const SCALE_FACTOR = 10^14;

// class ScaledVector {
//     constructor(x, y, z, t) {
//         this.x = x * SCALE_FACTOR;
//         this.y = y * SCALE_FACTOR;
//         this.z = z * SCALE_FACTOR;
//         this.t = t;
//     }
// }

export class OrbitController {
    constructor(params) {
        this._params = params;
        this._isBuiltIn = this._params.id in Astronomy.Body;
    }

    // scaleAstroVector = function(vector) {
    //     return new ScaledVector(
    //         vector.x * SCALE_FACTOR,
    //         vector.y * SCALE_FACTOR,
    //         vector.z * SCALE_FACTOR,
    //         vector.t
    //     );
    // }

    calculatePosition = function(dateTime) {
        if (this._isBuiltIn) {
            return Astronomy.HelioVector(this._params.id, dateTime)
        } else {
            return this._params.position(day);
        }
    };

    

    calculateAuRadius = function() {
        if (this._params.unit === "KM") {
            return (this._params.radius ? this._params.radius : 1) / Astronomy.KM_PER_AU;
        } else {
            return this._params.radius ? this._params.radius : 1;
        }
    };
}