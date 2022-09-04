import { render, screen } from "@testing-library/react";
import { Header } from ".";

jest.mock('next/router', () => {
  return {
    useRouter() {
      return {
        asPath: '/'
      };
    }
  };
});

jest.mock('next-auth/client', () => {
  return {
    useSession() {
      return [null]
    }
  }
});

describe('Header component', () => {
  test('should render correctly', () => {
    render(
      <Header />
    );

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Home')).toHaveClass('active');
    expect(screen.getByText('Posts')).toBeInTheDocument();
  });
});