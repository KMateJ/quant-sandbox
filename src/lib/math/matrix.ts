/// A dense matrix as an array of row arrays. Rows must all share the same length.
export type Matrix = number[][];
/// A dense vector.
export type Vector = number[];

/// Dot product of two equal-length vectors.
export function dot(a: Vector, b: Vector): number {
  if (a.length !== b.length) throw new Error("dot: vectors must be equal length");
  let s = 0;
  for (let i = 0; i < a.length; i++) s += a[i] * b[i];
  return s;
}

/// The `n`×`n` identity matrix.
export function identity(n: number): Matrix {
  const m: Matrix = Array.from({ length: n }, () => new Array<number>(n).fill(0));
  for (let i = 0; i < n; i++) m[i][i] = 1;
  return m;
}

/// Transpose of a matrix.
export function transpose(m: Matrix): Matrix {
  const rows = m.length;
  const cols = rows === 0 ? 0 : m[0].length;
  const out: Matrix = Array.from({ length: cols }, () => new Array<number>(rows));
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) out[j][i] = m[i][j];
  }
  return out;
}

/// Matrix product `a · b`. Throws when inner dimensions disagree.
export function matMul(a: Matrix, b: Matrix): Matrix {
  const n = a.length;
  const k = a[0]?.length ?? 0;
  const m = b[0]?.length ?? 0;
  if (b.length !== k) throw new Error("matMul: inner dimensions must match");
  const out: Matrix = Array.from({ length: n }, () => new Array<number>(m).fill(0));
  for (let i = 0; i < n; i++) {
    for (let p = 0; p < k; p++) {
      const aip = a[i][p];
      if (aip === 0) continue;
      for (let j = 0; j < m; j++) out[i][j] += aip * b[p][j];
    }
  }
  return out;
}

/// Matrix–vector product `m · v`.
export function matVec(m: Matrix, v: Vector): Vector {
  if ((m[0]?.length ?? 0) !== v.length) {
    throw new Error("matVec: matrix columns must match vector length");
  }
  return m.map((row) => dot(row, v));
}

/// Inverse of a square matrix via Gauss–Jordan elimination with partial pivoting.
/// Throws if the matrix is singular (pivot below 1e-12).
export function inverse(m: Matrix): Matrix {
  const n = m.length;
  if (n === 0 || m.some((r) => r.length !== n)) {
    throw new Error("inverse: matrix must be square");
  }
  // Augment [m | I] working on copies.
  const a = m.map((row) => row.slice());
  const inv = identity(n);

  for (let col = 0; col < n; col++) {
    let pivot = col;
    for (let r = col + 1; r < n; r++) {
      if (Math.abs(a[r][col]) > Math.abs(a[pivot][col])) pivot = r;
    }
    if (Math.abs(a[pivot][col]) < 1e-12) throw new Error("inverse: matrix is singular");
    if (pivot !== col) {
      [a[col], a[pivot]] = [a[pivot], a[col]];
      [inv[col], inv[pivot]] = [inv[pivot], inv[col]];
    }
    const pv = a[col][col];
    for (let j = 0; j < n; j++) {
      a[col][j] /= pv;
      inv[col][j] /= pv;
    }
    for (let r = 0; r < n; r++) {
      if (r === col) continue;
      const factor = a[r][col];
      if (factor === 0) continue;
      for (let j = 0; j < n; j++) {
        a[r][j] -= factor * a[col][j];
        inv[r][j] -= factor * inv[col][j];
      }
    }
  }
  return inv;
}

/// Quadratic form `wᵀ · M · w` (e.g. portfolio variance from weights and a covariance matrix).
export function quadraticForm(w: Vector, m: Matrix): number {
  return dot(w, matVec(m, w));
}
