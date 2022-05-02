import { Validation } from '@/presentation/helpers/validators/validation';

export class ValidationComposite implements Validation {
  private readonly validations: Validation[];

  constructor(validations: Validation[]) {
    this.validations = validations;
  }

  validate(input: any): Error {
    let response: Error = null;

    this.validations.find((validation) => {
      const error = validation.validate(input);

      if (error) response = error;

      return !!error;
    });

    return response;
  }
}
