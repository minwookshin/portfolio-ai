export class Spring {
  constructor(value = 0, { response = 0.32, dampingRatio = 0.9 } = {}) {
    this.value = value;
    this.target = value;
    this.velocity = 0;
    this.response = response;
    this.dampingRatio = dampingRatio;
  }

  setTarget(target) {
    this.target = target;
  }

  snap(value = this.target) {
    this.value = value;
    this.target = value;
    this.velocity = 0;
  }

  step(dt) {
    const safeDt = Math.max(0, Math.min(dt, 0.05));
    if (!safeDt) return this.value;
    const omega = (Math.PI * 2) / Math.max(this.response, 0.001);
    const stiffness = omega * omega;
    const damping = 2 * this.dampingRatio * omega;
    const acceleration = stiffness * (this.target - this.value) - damping * this.velocity;
    this.velocity += acceleration * safeDt;
    this.value += this.velocity * safeDt;
    return this.value;
  }
}
