using BookMySpace.Models;
using Microsoft.EntityFrameworkCore;
using System;

namespace BookMySpace.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options) { }
        
        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<Facility> Facilities { get; set; }
        public DbSet<FacilityImage> FacilityImages { get; set; }
        public DbSet<Booking> Bookings { get; set; }
        public DbSet<Review> Reviews { get; set; }
        public DbSet<Document> Documents { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Unique Email Constraint
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();
            
            modelBuilder.Entity<Booking>()
                .HasOne(b => b.User)
                .WithMany(u => u.Bookings)
                .HasForeignKey(b => b.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Booking>()
                .HasOne(b => b.Facility)
                .WithMany(f => f.Bookings)
                .HasForeignKey(b => b.FacilityId)
                .OnDelete(DeleteBehavior.Cascade);
            
            // REVIEW: prevent multiple cascade paths
            modelBuilder.Entity<Review>()
                .HasOne(r => r.User)
                .WithMany(u => u.Reviews)
                .HasForeignKey(r => r.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Review>()
                .HasOne(r => r.Facility)
                .WithMany(f => f.Reviews)
                .HasForeignKey(r => r.FacilityId)
                .OnDelete(DeleteBehavior.Cascade);
            // Fix cascade delete issue 
            // initial migration add karti vakhte jyare hu user delete karu to 2 cascading path hata j bookings a pochta ta
            // User to booking and user to facility to booking which creates a situation if i delete user
            // to a banne jagya a thi booking delete karva jaat
            
            //user delete thase to booking jaate delete nai thay

            //facility delete thase to booking delete
            // -----------------------
            // Seed Data Section
            // -----------------------

            // Roles
            modelBuilder.Entity<Role>().HasData(
                new Role { RoleId = 1, RoleName = "Admin" },
                new Role { RoleId = 2, RoleName = "Owner" },
                new Role { RoleId = 3, RoleName = "Customer" }
            );

            // Users
            modelBuilder.Entity<User>().HasData(
                new User
                {
                    UserId = 1,
                    FullName = "System Admin",
                    Email = "admin@bookmyspace.com",
                    Password = "admin123", // hash later
                    RoleId = 1,
                    Phone = "9999999999",
                    IsActive = true,
                    CreatedAt = DateTime.Now
                },
                new User
                {
                    UserId = 2,
                    FullName = "Facility Owner",
                    Email = "owner@bookmyspace.com",
                    Password = "owner123",
                    RoleId = 2,
                    Phone = "8888888888",
                    IsActive = true,
                    CreatedAt = DateTime.Now
                },
                new User
                {
                    UserId = 3,
                    FullName = "Normal Customer",
                    Email = "customer@bookmyspace.com",
                    Password = "customer123",
                    RoleId = 3,
                    Phone = "7777777777",
                    IsActive = true,
                    CreatedAt = DateTime.Now
                }
            );

            // Facility
            modelBuilder.Entity<Facility>().HasData(
                new Facility
                {
                    FacilityId = 1,
                    UserId = 2,
                    Name = "City Convention Hall",
                    Contact = "9090909090",
                    Description = "A large AC hall for events and weddings.",
                    City = "Ahmedabad",
                    Address = "CG Road, Navrangpura",
                    Category = "Hall",
                    PricePerHour = 1500,
                    IsGovOwned = false,
                    IsApproved = true,
                    CreatedAt = DateTime.Now
                }
            );

            // Images
            modelBuilder.Entity<FacilityImage>().HasData(
                new FacilityImage
                {
                    ImageId = 1,
                    FacilityId = 1,
                    ImageUrl = "https://example.com/hall1.jpg"
                },
                new FacilityImage
                {
                    ImageId = 2,
                    FacilityId = 1,
                    ImageUrl = "https://example.com/hall2.jpg"
                }
            );

            // Booking
            modelBuilder.Entity<Booking>().HasData(
                new Booking
                {
                    BookingId = 1,
                    FacilityId = 1,
                    UserId = 3,
                    StartDate = new DateTime(2025, 02, 15),
                    EndDate = new DateTime(2025, 02, 15),
                    StartTime = new TimeSpan(10, 0, 0),
                    EndTime = new TimeSpan(12, 0, 0),
                    TotalPrice = 3000,
                    BookingStatus = "Confirmed",
                    CreatedAt = DateTime.Now
                }
            );

            // Review
            modelBuilder.Entity<Review>().HasData(
                new Review
                {
                    ReviewId = 1,
                    FacilityId = 1,
                    UserId = 3,
                    Rating = 5,
                    Comment = "Great place, clean and spacious!",
                    CreatedAt = DateTime.Now
                }
            );
        }
    }
}

