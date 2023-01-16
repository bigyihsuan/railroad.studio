import {Rotator, Vector} from './Gvas';

const RADIANS_PER_DEGREE = Math.PI / 180;

type RotationMatrix = {
    forward: Vector,
    right: Vector,
    up: Vector,
};

/**
 * Computes the dot product of two vectors.
 *
 * The dot product of two vectors is a scalar value that represents the cosine
 * of the angle between the two vectors. It can also be interpreted as the
 * projection of one vector onto the other, or the product of the magnitudes of
 * the vectors and the cosine of the angle between them. In 2D space, it is
 * equivalent to the area of a trapezoid formed by the two vectors.
 *
 * @param {Vector} v1 - The first vector.
 * @param {Vector} v2 - The second vector.
 * @return {number} The dot product of the two vectors.
 */
export function dotProduct(v1: Vector, v2: Vector): number {
    return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
}

/**
 * Calculates the sum of two vectors by adding their corresponding x, y and z values.
 *
 * @param {Vector} a - The first vector to be added.
 * @param {Vector} b - The second vector to be added.
 * @return {Vector} The sum of the two input vectors.
 */
export const vectorSum = (a: Vector, b: Vector): Vector => ({
    x: a.x + b.x,
    y: a.y + b.y,
    z: a.z + b.z,
});

/**
 * Computes a rotation matrix from a given rotator.
 *
 * A rotation matrix is a 3x3 matrix that is used to rotate a vector in 3D
 * space. This function takes in a rotator (which represents rotations around
 * the pitch, yaw, and roll axes) and uses trigonometric functions to calculate
 * the corresponding forward, right, and up vectors that make up the rotation
 * matrix.
 *
 * @param {Rotator} rotator - The rotator used to calculate the rotation matrix.
 * @return {RotationMatrix} The rotation matrix that corresponds to the given rotator.
 */
export function getRotationMatrix(rotator: Rotator): RotationMatrix {
    const pitch = -rotator.pitch * RADIANS_PER_DEGREE;
    const roll = -rotator.roll * RADIANS_PER_DEGREE;
    const yaw = -rotator.yaw * RADIANS_PER_DEGREE;
    const cosPitch = Math.cos(pitch);
    const cosRoll = Math.cos(roll);
    const cosYaw = Math.cos(yaw);
    const sinPitch = Math.sin(pitch);
    const sinRoll = Math.sin(roll);
    const sinYaw = Math.sin(yaw);
    return {
        forward: {
            x: cosYaw * cosPitch,
            y: sinYaw * cosPitch,
            z: sinPitch,
        },
        right: {
            x: cosYaw * sinPitch * sinRoll - sinYaw * cosRoll,
            y: sinYaw * sinPitch * sinRoll + cosYaw * cosRoll,
            z: cosPitch * sinRoll,
        },
        up: {
            x: cosYaw * sinPitch * cosRoll + sinYaw * sinRoll,
            y: sinYaw * sinPitch * cosRoll - cosYaw * sinRoll,
            z: cosPitch * cosRoll,
        },
    };
}

export function rotateVector(vector: Vector, rotator: Rotator): Vector {
    const {forward, right, up} = getRotationMatrix(rotator);
    const x = dotProduct(vector, forward);
    const y = dotProduct(vector, right);
    const z = dotProduct(vector, up);
    return {x, y, z};
}
