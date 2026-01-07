import type { Config } from "jest";


const config: Config = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleFileExtensions: ["ts", "tsx", "js"],
  testPathIgnorePatterns: [
  "<rootDir>/lib/db/__tests__"
],

};

export default config;