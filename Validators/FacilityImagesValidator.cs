namespace BookMySpace.Validators;

using FluentValidation;

public class FacilityImageValidator : AbstractValidator<AddUpdateFacilityImageDTO>
{
    public FacilityImageValidator()
    {
        RuleFor(nameOfDto => nameOfDto.FacilityId)
            .GreaterThan(0);

        RuleFor(nameOfDto => nameOfDto.ImageUrl)
            .NotEmpty()
            .MaximumLength(500)
            .Must(url => Uri.IsWellFormedUriString(url, UriKind.Absolute))
            .WithMessage("Invalid image URL format");
    }
}