//const SCALE_FACTOR = 10^14;

export class PlanetOrbitController {
    constructor(body) {
        this._body = body;
        this._isBuiltIn = this._body.params.id in Astronomy.Body;
    }

    calculatePosition = function(dateTime) {
        if (false && this._isBuiltIn) {
            return Astronomy.HelioVector(this.body.params.id, dateTime)
        } else {
            // Get current heliocentric XYZ coordinates
            CalculationHandler.updateMeanElements(dateTime, this._body);
            return CalculationHandler.getHelioXYZR(this._body);
            //return this.body.params.position(day);
        }
    };

    calculateAuRadius = function() {
        if (this._body.params.unit === "KM") {
            return (this._body.params.radius ? this._body.params.radius : 1) / Astronomy.KM_PER_AU;
        } else {
            return this._body.params.radius ? this._body.params.radius : 1;
        }
    };
}

export class OrbitController {
    constructor(body) {
        this._body = body;
        this._isBuiltIn = this._body.params.id in Astronomy.Body;
    }

    calculatePosition = function(dateTime) {
        if (this._isBuiltIn) {
            return Astronomy.HelioVector(this.body.params.id, dateTime)
        } else {
            // Get current heliocentric XYZ coordinates
            CalculationHandler.updateMeanElements(dateTime, this._body);
            //return this.body.params.position(day);
        }
    };

    calculateAuRadius = function() {
        if (this._body.params.unit === "KM") {
            return (this._body.params.radius ? this._body.params.radius : 1) / Astronomy.KM_PER_AU;
        } else {
            return this._body.params.radius ? this._body.params.radius : 1;
        }
    };
}