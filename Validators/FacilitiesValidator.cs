namespace BookMySpace.Validators;
using FluentValidation;

public class FacilityValidator : AbstractValidator<AddUpdateFacilityDTO>
{
    public FacilityValidator()
    {
        RuleFor(nameOfDto => nameOfDto.UserId)
            .GreaterThan(0);

        RuleFor(nameOfDto => nameOfDto.Name)
            .NotEmpty()
            .MaximumLength(150);

        RuleFor(nameOfDto => nameOfDto.Contact)
            .MaximumLength(20)
            .When(x => x.Contact != null);

        RuleFor(nameOfDto => nameOfDto.Description)
            .MaximumLength(500)
            .When(x => x.Description != null);

        RuleFor(nameOfDto => nameOfDto.City)
            .NotEmpty()
            .MaximumLength(100);

        RuleFor(nameOfDto => nameOfDto.Address)
            .MaximumLength(300)
            .When(x => x.Address != null);

        RuleFor(nameOfDto => nameOfDto.Category)
            .NotEmpty()
            .MaximumLength(50);

        RuleFor(nameOfDto => nameOfDto.PricePerHour)
            .GreaterThanOrEqualTo(0);

        RuleFor(nameOfDto => nameOfDto.IsGovOwned)
            .NotNull();
    }
}