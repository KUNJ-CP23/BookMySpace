using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BookMySpace.Migrations
{
    /// <inheritdoc />
    public partial class AddPaymentTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Payments",
                columns: table => new
                {
                    PaymentId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    BookingId = table.Column<int>(type: "int", nullable: false),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    Amount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    PaymentType = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    PaymentMethod = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    PaymentStatus = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    TransactionId = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    OfflineReferenceNumber = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Remarks = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    PaidAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Payments", x => x.PaymentId);
                    table.ForeignKey(
                        name: "FK_Payments_Bookings_BookingId",
                        column: x => x.BookingId,
                        principalTable: "Bookings",
                        principalColumn: "BookingId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Payments_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.UpdateData(
                table: "Bookings",
                keyColumn: "BookingId",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 20, 13, 19, 37, 450, DateTimeKind.Local).AddTicks(6930));

            migrationBuilder.UpdateData(
                table: "Facilities",
                keyColumn: "FacilityId",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 20, 13, 19, 37, 450, DateTimeKind.Local).AddTicks(6900));

            migrationBuilder.UpdateData(
                table: "Reviews",
                keyColumn: "ReviewId",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 20, 13, 19, 37, 450, DateTimeKind.Local).AddTicks(6940));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "UserId",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 20, 13, 19, 37, 450, DateTimeKind.Local).AddTicks(6870));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "UserId",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 20, 13, 19, 37, 450, DateTimeKind.Local).AddTicks(6880));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "UserId",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 20, 13, 19, 37, 450, DateTimeKind.Local).AddTicks(6880));

            migrationBuilder.CreateIndex(
                name: "IX_Payments_BookingId",
                table: "Payments",
                column: "BookingId");

            migrationBuilder.CreateIndex(
                name: "IX_Payments_UserId",
                table: "Payments",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Payments");

            migrationBuilder.UpdateData(
                table: "Bookings",
                keyColumn: "BookingId",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 12, 27, 14, 18, 11, 142, DateTimeKind.Local).AddTicks(8480));

            migrationBuilder.UpdateData(
                table: "Facilities",
                keyColumn: "FacilityId",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 12, 27, 14, 18, 11, 142, DateTimeKind.Local).AddTicks(8450));

            migrationBuilder.UpdateData(
                table: "Reviews",
                keyColumn: "ReviewId",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 12, 27, 14, 18, 11, 142, DateTimeKind.Local).AddTicks(8490));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "UserId",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 12, 27, 14, 18, 11, 142, DateTimeKind.Local).AddTicks(8430));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "UserId",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 12, 27, 14, 18, 11, 142, DateTimeKind.Local).AddTicks(8430));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "UserId",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2025, 12, 27, 14, 18, 11, 142, DateTimeKind.Local).AddTicks(8430));
        }
    }
}
