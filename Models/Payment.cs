using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BookMySpace.Models
{
    public class Payment
    {
        [Key]
        public int PaymentId { get; set; }

        [Required]
        public int BookingId { get; set; }

        [ForeignKey(nameof(BookingId))]
        public Booking Booking { get; set; }

        [Required]
        public int UserId { get; set; }   // payer

        [ForeignKey(nameof(UserId))]
        public User User { get; set; }

        [Required]
        public decimal Amount { get; set; }

        // Online / Offline
        [Required, MaxLength(20)]
        public string PaymentType { get; set; }

        // Online: UPI/Card/NetBanking
        // Offline: Counter/Challan/ChequeDD
        [Required, MaxLength(50)]
        public string PaymentMethod { get; set; }

        // Pending / Success / Failed / VerificationPending
        [Required, MaxLength(50)]
        public string PaymentStatus { get; set; } = "Pending";

        // Only for Online payments
        [MaxLength(200)]
        public string? TransactionId { get; set; }

        // Only for Offline payments (Gov owned) - OPTIONAL
        [MaxLength(200)]
        public string? OfflineReferenceNumber { get; set; } // challan/receipt/cheque number

        [MaxLength(500)]
        public string? Remarks { get; set; }

        public DateTime PaidAt { get; set; } = DateTime.Now;

        public bool IsActive { get; set; } = true;
    }
}

public class AddUpdatePaymentDTO
{
    public int BookingId { get; set; }
    public int UserId { get; set; }
    public decimal Amount { get; set; }
    
    // Online: UPI/Card/NetBanking
    // Offline: Counter/Challan/ChequeDD
    public string PaymentMethod { get; set; }

    // Online only
    public string TransactionId { get; set; }

    // Offline only (Optional)
    public string OfflineReferenceNumber { get; set; }

    public string? Remarks { get; set; }
}