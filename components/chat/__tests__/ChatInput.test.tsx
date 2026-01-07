import { render, screen, fireEvent } from "@testing-library/react";
import { ChatInput } from "../ChatInput";

test("calls onSend when clicked", () => {
  const mockFn = jest.fn();

  render(<ChatInput onSend={mockFn} />);
  fireEvent.click(screen.getByText("Send"));

  expect(mockFn).toHaveBeenCalledWith("hello");
});
