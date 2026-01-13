namespace BookMySpace.Validators;

using FluentValidation;

public class FacilityImageValidator : AbstractValidator<AddUpdateFacilityImageDTO>
{
    public FacilityImageValidator()
    {
        RuleFor(nameOfDto => nameOfDto.FacilityId)
            .GreaterThan(0);

        // RuleFor(nameOfDto => nameOfDto.ImageUrl)
        //     .NotEmpty()
        //     .MaximumLength(500)
        //     .Must(url => Uri.IsWellFormedUriString(url, UriKind.Absolute))
        //     .WithMessage("Invalid image URL format");
        
        // RuleFor(nameOfDto => nameOfDto.ImagePath)
        //     .NotEmpty().WithMessage("Image URL is required")
        //     .MaximumLength(500).WithMessage("Image URL cannot exceed 500 characters")
        //     .Matches(@"^https?://").WithMessage("Image URL must start with http:// or https://");
    }
}