import { vi, describe, test, expect } from "vitest";
import { getUserDiscount } from "../../src/services/getUserDiscount.js";

describe("getUserDiscount", () => {
  test("คืนส่วนลด 20 เมื่อ user เป็นระดับ gold", () => {
    // Arrange
    const userId = 1;
    const userRepository = {
      findById: vi.fn().mockReturnValue({ id: 1, membership: "gold" }),
    };

    // Act
    const result = getUserDiscount(userId, userRepository);

    // Assert
    expect(result).toBe(20);
  });

  test("คืนส่วนลด 10 เมื่อ user เป็นระดับ silver", () => {
    // Arrange
    const userId = 2;
    const userRepository = {
      findById: vi.fn().mockReturnValue({ id: 2, membership: "silver" }),
    };

    // Act
    const result = getUserDiscount(userId, userRepository);

    // Assert
    expect(result).toBe(10);
  });

  test("คืนส่วนลด 0 เมื่อ user เป็นระดับ basic", () => {
    // Arrange
    const userId = 3;
    const userRepository = {
      findById: vi.fn().mockReturnValue({ id: 3, membership: "basic" }),
    };

    // Act
    const result = getUserDiscount(userId, userRepository);

    // Assert
    expect(result).toBe(0);
  });

  test("โยน Error เมื่อไม่พบ user (null)", () => {
    // Arrange
    const userId = 999;
    const userRepository = {
      findById: vi.fn().mockReturnValue(null),
    };

    // Act & Assert
    expect(() => getUserDiscount(userId, userRepository)).toThrow(
      "ไม่พบ user นี้ในระบบ",
    );
  });

  test("โยน Error เมื่อไม่พบ user (undefined)", () => {
    // Arrange
    const userId = 1000;
    const userRepository = {
      findById: vi.fn().mockReturnValue(undefined),
    };

    // Act & Assert
    expect(() => getUserDiscount(userId, userRepository)).toThrow(
      "ไม่พบ user นี้ในระบบ",
    );
  });

  test("เรียก findById ด้วย userId ที่ถูกต้องเพียง 1 ครั้ง", () => {
    // Arrange
    const userId = 5;
    const userRepository = {
      findById: vi.fn().mockReturnValue({ id: 5, membership: "silver" }),
    };

    // Act
    getUserDiscount(userId, userRepository);

    // Assert
    expect(userRepository.findById).toHaveBeenCalledWith(5);
    expect(userRepository.findById).toHaveBeenCalledTimes(1);
  });
});
