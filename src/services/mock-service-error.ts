import { AxiosError } from 'axios';
import { throwError } from 'rxjs';
export default function mockServiceError() {
  const errorFactory = () => {
    const mockAxiosError: AxiosError = {
      name: 'Mock Server Error',
      message: 'Internal Server Error',
      config: {
        headers: undefined,
      }, // Simplified; fill out as needed for your test
      code: '500',
      isAxiosError: true,
      toJSON: () => ({}), // Simplified; implement as needed
      response: {
        data: {
          error: 'Internal Server Error',
        },
        status: 500,
        statusText: 'Internal Server Error',
        headers: {},
        config: {
          headers: undefined,
        },
      },
    };

    // Use throwError to simulate an error response
    return mockAxiosError;
  };
  return throwError(errorFactory);
}
