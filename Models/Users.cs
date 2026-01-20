using System;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BookMySpace.Models
{
    public class User
    {
        [Key]
        public int UserId { get; set; }

        [Required, MaxLength(100)]
        public string FullName { get; set; }

        [Required, MaxLength(200)]
        public string Email { get; set; }

        [Required]
        public string Password { get; set; }
        
        [MaxLength(20)]
        public string Phone { get; set; }

        public bool IsActive { get; set; } = true;

        [Required]
        public int RoleId { get; set; }

        [ForeignKey(nameof(RoleId))]
        public Role Role { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.Now;
        
        public ICollection<Facility> Facilities { get; set; }
        public ICollection<Booking> Bookings { get; set; }
        public ICollection<Review> Reviews { get; set; }
        
        public ICollection<Payment> Payments { get; set; }
    }
}

public class AddUpdateUserDTO
{
    // [Required, MaxLength(100)]
    public string FullName { get; set; }

    // [Required, MaxLength(200)]
    public string Email { get; set; }
    // [Required]
    public string Password { get; set; }
    [ForeignKey(nameof(RoleId))]
    public int RoleId { get; set; }
    // [MaxLength(20)]
    public string Phone { get; set; }
}