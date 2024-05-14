import { render } from "@testing-library/react-native";
import { NavigationContainer } from "@react-navigation/native";
import ContactScreen from "./ContactScreen";

test("should render ContactScreen", () => {
  const { getByTestId, getByText } = render(
    <NavigationContainer>
      <ContactScreen />
    </NavigationContainer>
  );

  expect(getByTestId("contact-screen")).toBeTruthy();

  // Check if the expected text content is present
  const text1 = getByText("Se precisa de ajuda ou feedback.");
  const text2 = getByText("Entre em contato.");
  const emailText = getByText("contato@criar.art");
  const linkedinText = getByText("linkedin.com/in/lucasferreiralimax");

  expect(text1).toBeTruthy();
  expect(text2).toBeTruthy();
  expect(emailText).toBeTruthy();
  expect(linkedinText).toBeTruthy();
});
