import { describe, test, expect } from "vitest";
import { calculateTotal } from "../../src/utils/calculateTotal.js";

describe("calculateTotal", () => {
  test("คำนวณราคารวมถูกต้องเมื่อ quantity > 1", () => {
    // Arrange
    const price = 100;
    const quantity = 3;

    // Act
    const result = calculateTotal(price, quantity);

    // Assert
    expect(result).toBe(300);
  });

  test("คำนวณราคารวมถูกต้องเมื่อ quantity เป็น 1", () => {
    // Arrange
    const price = 100;
    const quantity = 1;

    // Act
    const result = calculateTotal(price, quantity);

    // Assert
    expect(result).toBe(100);
  });

  test("คืนค่า 0 เมื่อราคาเป็น 0 แต่ quantity ถูกต้อง", () => {
    // Arrange
    const price = 0;
    const quantity = 5;

    // Act
    const result = calculateTotal(price, quantity);

    // Assert
    expect(result).toBe(0);
  });

  test("คืนค่า 0 เมื่อ quantity เป็น 0", () => {
    // Arrange
    const price = 100;
    const quantity = 0;

    // Act
    const result = calculateTotal(price, quantity);

    // Assert
    expect(result).toBe(0);
  });

  test("คืนค่า 0 เมื่อ quantity น้อยกว่า 0", () => {
    // Arrange
    const price = 100;
    const quantity = -2;

    // Act
    const result = calculateTotal(price, quantity);

    // Assert
    expect(result).toBe(0);
  });

  test("โยน Error เมื่อราคาติดลบ", () => {
    // Arrange
    const price = -10;
    const quantity = 2;

    // Act & Assert
    expect(() => calculateTotal(price, quantity)).toThrow("ราคาต้องไม่ติดลบ");
  });
});
