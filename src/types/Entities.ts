export interface PhysicsEntity {
    gridX: number;
    logicalY: number;
    velocityY: number;
    isGrounded: boolean;
    // For visualization/updates
    x: number;
    y: number;
}
