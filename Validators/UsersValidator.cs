namespace BookMySpace.Validators;

using FluentValidation;

public class UserValidator : AbstractValidator<AddUpdateUserDTO>
{
    public UserValidator()
    {
        RuleFor(nameOfDto => nameOfDto.FullName)
            .NotEmpty()
            .MaximumLength(100);

        RuleFor(nameOfDto => nameOfDto.Email)
            .NotEmpty()
            .EmailAddress()
            .MaximumLength(200);

        RuleFor(nameOfDto => nameOfDto.Password)
            .NotEmpty()
            .MinimumLength(6);

        RuleFor(nameOfDto => nameOfDto.RoleId)
            .GreaterThan(0);

        RuleFor(nameOfDto => nameOfDto.Phone)
            .NotEmpty()
            .MaximumLength(20);

    }
}