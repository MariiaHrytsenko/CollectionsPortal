using System;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using collectionsProject.Models;
using Microsoft.EntityFrameworkCore;
using collectionsProject.Settings;

namespace collectionsProject.Services
{
    public class InvitationService
    {
        private readonly DbFromExistingContext _dbContext;
        private readonly SmtpSettings _smtpSettings;

        public InvitationService(DbFromExistingContext dbContext, IOptions<SmtpSettings> smtpOptions)
        {
            _dbContext = dbContext;
            _smtpSettings = smtpOptions.Value;
        }

        public async Task<bool> SendInvitationAsync(string inviterId, string inviteeEmail)
        {
            // Перевірити, чи запрошує сам себе
            var inviter = await _dbContext.Users.FirstOrDefaultAsync(u => u.Id == inviterId);
            if (inviter == null)
                throw new Exception("Inviter not found");

            if (inviter.Email.Equals(inviteeEmail, StringComparison.OrdinalIgnoreCase))
                throw new Exception("You cannot invite yourself.");

            // Перевірити, чи вже існує запрошення
            var existingInvitation = await _dbContext.Invitations
                .FirstOrDefaultAsync(i => i.Email == inviteeEmail && i.IDinviter == inviterId);

            if (existingInvitation != null)
                throw new Exception("Invitation already sent.");

            // Отримати користувача, якщо він уже зареєстрований
            var userToInvite = await _dbContext.Users.FirstOrDefaultAsync(u => u.Email == inviteeEmail);

            // Створити запрошення
            var invitation = new Invitation
            {
                CreatedDate = DateTime.UtcNow,
                Email = inviteeEmail,
                IDinviter = inviterId,
                IDrequester = userToInvite?.Id, // якщо користувач існує — зберігаємо, якщо ні — залишаємо null
                Token = Guid.NewGuid().ToString()
            };

            // Додати в БД
            _dbContext.Invitations.Add(invitation);
            await _dbContext.SaveChangesAsync();

            // Відправити email
            SendEmail(inviteeEmail, invitation.Token);

            return true;
        }

        private void SendEmail(string toEmail, string token)
        {
            var fromAddress = new MailAddress(_smtpSettings.FromEmail, "CollectionsProject");
            var toAddress = new MailAddress(toEmail);
            var subject = "Zaproszenie do grona znajomych";
            var body = $"Dzień dobry,\n\n" +
                       $"Otrzymałeś zaproszenie do grona znajomych w aplikacji CollectionsProject.\n" +
                       $"Aby zaakceptować zaproszenie, kliknij w poniższy link:\n" +
                       $"http://localhost:3000/friends?token={token}\n\n" +
                       "Pozdrawiamy,\nZespół CollectionsProject";

            using var smtp = new SmtpClient
            {
                Host = _smtpSettings.Host,
                Port = _smtpSettings.Port,
                EnableSsl = _smtpSettings.EnableSsl,
                Credentials = new NetworkCredential(_smtpSettings.UserName, _smtpSettings.Password)
            };

            using var message = new MailMessage(fromAddress, toAddress)
            {
                Subject = subject,
                Body = body
            };

            smtp.Send(message);
        }
    }
}