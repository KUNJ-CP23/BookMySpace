namespace BookMySpace.Validators;

using FluentValidation;

public class BookingValidator : AbstractValidator<AddUpdateBookingDTO>
{
    public BookingValidator()
    {
        RuleFor(nameOfDto => nameOfDto.FacilityId)
            .GreaterThan(0);

        RuleFor(nameOfDto => nameOfDto.UserId)
            .GreaterThan(0);

        RuleFor(nameOfDto => nameOfDto.StartDate)
            .NotEmpty();

        RuleFor(nameOfDto => nameOfDto.EndDate)
            .NotEmpty()
            .GreaterThanOrEqualTo(x => x.StartDate);

        RuleFor(nameOfDto => nameOfDto.StartTime)
            .NotEmpty();

        RuleFor(nameOfDto => nameOfDto.EndTime)
            .NotEmpty()
            .GreaterThan(x => x.StartTime)
            .WithMessage("End time must be greater than start time");
    }
}