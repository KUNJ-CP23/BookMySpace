namespace BookMySpace.Validators;

using FluentValidation;

public class ReviewValidator : AbstractValidator<AddUpdateReviewDTO>
{
    public ReviewValidator()
    {
        RuleFor(nameOfDto => nameOfDto.FacilityId)
            .GreaterThan(0);

        RuleFor(nameOfDto => nameOfDto.UserId)
            .GreaterThan(0);

        RuleFor(nameOfDto => nameOfDto.Rating)
            .InclusiveBetween(1, 5);

        RuleFor(nameOfDto => nameOfDto.Comment)
            .NotEmpty()
            .MaximumLength(500);
    }
}