namespace BookMySpace.Validators;

using FluentValidation;

public class DocumentValidator : AbstractValidator<AddUpdateDocumentDTO>
{
    public DocumentValidator()
    {
        RuleFor(nameOfDto => nameOfDto.FacilityId)
            .GreaterThan(0);

        RuleFor(nameOfDto => nameOfDto.DocumentType)
            .NotEmpty()
            .MaximumLength(100);

        RuleFor(nameOfDto => nameOfDto.FileUrl)
            .NotEmpty()
            .MaximumLength(500);
    }
}