import { Pool } from "pg";
import { UserRepository } from "../../services/userService";
import { UserInfo } from "../../types/user";

describe("UserService", () => {
  let mockUserData: UserInfo;
  let pool: any;
  let client: any;

  beforeEach(() => {
    pool = new Pool();
    client = pool.connect();

    mockUserData = {
      name: "John Doe",
      email: "john.doe@example.com",
      username: "johndoe",
      password_hash: "hashedpassword123",
    };
  });

  describe("createUser", () => {
    it("should create a new user", async () => {
      const mockedResult = {
        name: mockUserData.name,
        email: mockUserData.email,
        username: mockUserData.username,
      };
      client.query.mockResolvedValueOnce({ rows: [mockedResult] });
      const createdUser = await UserRepository.createUser(
        mockUserData.username,
        mockUserData.email,
        mockUserData.name,
        mockUserData.password_hash,
        client
      );

      expect(createdUser.rows).toEqual([
        {
          name: "John Doe",
          email: "john.doe@example.com",
          username: "johndoe",
        },
      ]);
    });
  });

  describe("updateUserToken", () => {
    it("should update the user token", async () => {
      const username = "johndoe";
      const newToken = "newToken123";
      const mockedResult = {
        command: "UPDATE",
        rowCount: 1,
        oid: null,
        rows: [],
        fields: [],
      };
      client.query.mockResolvedValueOnce({ rows: [mockedResult] });
      const updatedUser = await UserRepository.updateUserToken(
        username,
        newToken,
        client
      );

      expect(updatedUser.rows).toEqual([
        {
          command: "UPDATE",
          rowCount: 1,
          oid: null,
          rows: [],
          fields: [],
        },
      ]);
    });
  });
  describe("getUserByUsername", () => {
    it("should get a user by username", async () => {
      const username = "johndoe";
      const mockedResult = {
        name: "John Doe",
        email: "",
        username: "johndoe",
        password_hash: "hashedpassword123",
      };
      client.query.mockResolvedValueOnce({ rows: [mockedResult] });
      const user = await UserRepository.getUserByUsername(username, client);
      expect(user.rows).toEqual([
        {
          name: "John Doe",
          email: "",
          username: "johndoe",
          password_hash: "hashedpassword123",
        },
      ]);
    });
  });

  describe("getUserByEmail", () => {
    it("should get a user by email", async () => {
      const email = "sadsad@email.com";
      const mockedResult = {
        name: "John Doe",
        email: "sadsad@email.com",
        username: "johndoe",
        password_hash: "hashedpassword123",
      };
      client.query.mockResolvedValueOnce({ rows: [mockedResult] });
      const user = await UserRepository.getUserByEmail(email, client);
      expect(user.rows).toEqual([
        {
          name: "John Doe",
          email: "sadsad@email.com",
          username: "johndoe",
          password_hash: "hashedpassword123",
        },
      ]);
    });
  });
});
