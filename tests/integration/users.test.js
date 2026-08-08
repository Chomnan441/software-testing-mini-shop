import { describe, test, expect, afterEach } from "vitest";
import request from "supertest";
import { app } from "../../src/app.js";
import { db } from "../../src/store/db.js";

describe("POST /users", () => {
  afterEach(() => {
    db.users.deleteAll();
  });

  test("สมัครสมาชิกสำเร็จเมื่อข้อมูลครบและถูกต้อง", async () => {
    // Arrange
    const payload = {
      email: "somchai.jai@example.com",
      password: "Pass1234",
      confirmPassword: "Pass1234",
      acceptedTerms: true,
    };

    // Act
    const response = await request(app).post("/users").send(payload);

    // Assert
    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      id: expect.any(Number),
      email: "somchai.jai@example.com",
    });
    expect(response.body).not.toHaveProperty("password");
  });

  test("คืน status 400 เมื่อไม่ส่ง email", async () => {
    // Arrange
    const payload = {
      password: "Pass1234",
      confirmPassword: "Pass1234",
      acceptedTerms: true,
    };

    // Act
    const response = await request(app).post("/users").send(payload);

    // Assert
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("email is required");
  });

  test("คืน status 400 เมื่อ confirmPassword ไม่ตรงกับ password", async () => {
    // Arrange
    const payload = {
      email: "mali.suk@example.com",
      password: "Pass1234",
      confirmPassword: "Pass9999",
      acceptedTerms: true,
    };

    // Act
    const response = await request(app).post("/users").send(payload);

    // Assert
    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      "confirmPassword does not match password",
    );
  });

  test("คืน status 400 เมื่อไม่ยอมรับเงื่อนไขการใช้งาน", async () => {
    // Arrange
    const payload = {
      email: "nuch.wan@example.com",
      password: "Pass1234",
      confirmPassword: "Pass1234",
      acceptedTerms: false,
    };

    // Act
    const response = await request(app).post("/users").send(payload);

    // Assert
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("acceptedTerms must be true");
  });

  test("คืน status 400 เมื่อ password สั้นกว่าค่าต่ำสุด 1 ตัว (ยาว 7)", async () => {
    // Arrange
    const payload = {
      email: "bee.short@example.com",
      password: "Pass123",
      confirmPassword: "Pass123",
      acceptedTerms: true,
    };

    // Act
    const response = await request(app).post("/users").send(payload);

    // Assert
    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      "password must be 8-20 characters long and contain both letters and numbers",
    );
  });

  test("สมัครสำเร็จเมื่อ password ยาวเท่าค่าต่ำสุด (ยาว 8) และมีตัวอักษรกับตัวเลข", async () => {
    // Arrange
    const payload = {
      email: "bee.ok@example.com",
      password: "Pass1234",
      confirmPassword: "Pass1234",
      acceptedTerms: true,
    };

    // Act
    const response = await request(app).post("/users").send(payload);

    // Assert
    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      id: expect.any(Number),
      email: "bee.ok@example.com",
    });
  });

  test("คืน error เมื่อ email ซ้ำในระบบ", async () => {
    // Arrange
    db.users.insert({
      email: "dup.user@example.com",
      password: "Pass1234",
      membership: "basic",
    });

    // Act
    const response = await request(app).post("/users").send({
      email: "dup.user@example.com",
      password: "Pass1234",
      confirmPassword: "Pass1234",
      acceptedTerms: true,
    });

    // Assert
    expect(response.status).toBe(409);
    expect(response.body.message).toBe("email is already registered");
  });
});
