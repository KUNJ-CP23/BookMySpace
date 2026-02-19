namespace BookMySpace.Validators;

using FluentValidation;

public class PaymentValidator : AbstractValidator<AddUpdatePaymentDTO>
{
    public PaymentValidator()
    {
        RuleFor(dto => dto.BookingId)
            .GreaterThan(0);

        RuleFor(dto => dto.UserId)
            .GreaterThan(0);

        RuleFor(dto => dto.Amount)
            .GreaterThan(0);

        RuleFor(dto => dto.PaymentMethod)
            .NotEmpty()
            .MaximumLength(50);

        RuleFor(dto => dto.TransactionId)
            .NotEmpty()
            .MaximumLength(200);
        
        // ✅ FIX (VERY IMPORTANT)
        RuleFor(dto => dto.OfflineReferenceNumber)
            .MaximumLength(200)
            .When(dto => dto.OfflineReferenceNumber != null);


        RuleFor(dto => dto.Remarks)
            .MaximumLength(500);
    }
}