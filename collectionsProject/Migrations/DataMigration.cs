using collectionsProject.OldModels;
using collectionsProject.Models;
using OldCategory = collectionsProject.OldModels.ModelCategory;
using NewCategory = collectionsProject.Models.ModelCategory;
using OldCharacteristic = collectionsProject.OldModels.ModelCharacteristic;
using NewCharacteristic = collectionsProject.Models.ModelCharacteristic;
using OldFriend = collectionsProject.OldModels.Friend;
using NewFriend = collectionsProject.Models.Friend;
using OldInvitation = collectionsProject.OldModels.Invitation;
using NewInvitation = collectionsProject.Models.Invitation;
using OldItem = collectionsProject.OldModels.Item;

namespace collectionsProject.Migrations
{
    public class DataMigration
    {
        private readonly OldDbContext _oldContext;
        private readonly DbFromExistingContext _newContext;

        public DataMigration(OldDbContext oldContext, DbFromExistingContext newContext)
        {
            _oldContext = oldContext;
            _newContext = newContext;
        }

        public void RunAllMigrations()
        {
            // MigrateUsers(); // Ігноруємо
            MigrateModelCategories();
            MigrateModelCharacteristics();
            // MigrateComments(); // Ігноруємо
            MigrateFriends();
            MigrateInvitations();

            _newContext.SaveChanges();
        }

        // private void MigrateUsers()
        // {
        //     // Ігноруємо цей метод
        // }

        private void MigrateModelCategories()
        {
            var oldCategories = _oldContext.ModelCategories.ToList();
            foreach (var oldCat in oldCategories)
            {
                var newCat = new NewCategory
                {
                    Idcategory = oldCat.IDcategory,
                    NameCategory = oldCat.NameCategory,
                    Id = oldCat.IDuser.ToString()
                };
                _newContext.ModelCategories.Add(newCat);
            }
        }

        private void MigrateModelCharacteristics()
        {
            var oldCharacteristics = _oldContext.ModelCharacteristics.ToList();
            foreach (var oldChr in oldCharacteristics)
            {
                var newChr = new NewCharacteristic
                {
                    Idcharacteristic = oldChr.IDcharacteristic,
                    NameCharacteristic = oldChr.NameCharacteristic,
                    Id = oldChr.IDuser.ToString()
                };
                _newContext.ModelCharacteristics.Add(newChr);
            }
        }

       
        // private void MigrateComments()
        // {
        //     // Ігноруємо цей метод
        // }

        private void MigrateFriends()
        {
            var oldFriends = _oldContext.Friends.ToList();
            foreach (var oldFriend in oldFriends)
            {
                var newFriend = new NewFriend
                {
                    IDfriendship = oldFriend.IDfriendship,
                    IDrequester = oldFriend.IDrequester.ToString(),
                    IDreceiver = oldFriend.IDreceiver.ToString()
                };
                _newContext.Friends.Add(newFriend);
            }
        }

        private void MigrateInvitations()
        {
            var oldInvitations = _oldContext.Invitations.ToList();
            foreach (var oldInv in oldInvitations)
            {
                var newInv = new NewInvitation
                {
                    IDinvitation = oldInv.IDinvitation,
                    Email = oldInv.Email,
                    Token = oldInv.Token,
                    IDinviter = oldInv.IDinviter.ToString(),
                    IDrequester = oldInv.IDrequester.ToString()
                };
                _newContext.Invitations.Add(newInv);
            }
        }
    }
}
