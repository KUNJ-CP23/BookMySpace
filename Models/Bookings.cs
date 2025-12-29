using System;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BookMySpace.Models
{
    public class Booking
    {
        [Key]
        public int BookingId { get; set; }

        // Facility nu relation
        [Required]
        public int FacilityId { get; set; }

        [ForeignKey(nameof(FacilityId))]
        public Facility Facility { get; set; }

        // Customer nu relation
        [Required]
        public int UserId { get; set; }   // Customer who booked

        [ForeignKey(nameof(UserId))]
        public User User { get; set; }

        // Booking Date & Time Slot
        [Required]
        public DateTime StartDate { get; set; }

        [Required]
        public DateTime EndDate { get; set; }

        //Timespan just stores Time hh:mm:ss format, similar to TIME in sql
        [Required]
        public TimeSpan StartTime { get; set; }

        [Required]
        public TimeSpan EndTime { get; set; }

        [Required]
        public decimal TotalPrice { get; set; }

        [Required, MaxLength(20)]
        public string BookingStatus { get; set; } = "Pending";

        public DateTime CreatedAt { get; set; } = DateTime.Now;
    }
}

public class AddUpdateBookingDTO
{
    public int FacilityId { get; set; }
    public int UserId { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public TimeSpan StartTime { get; set; }
    public TimeSpan EndTime { get; set; }
}