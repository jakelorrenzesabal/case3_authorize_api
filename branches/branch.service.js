const db = require('_helpers/db');
const { Sequelize } = require('sequelize');

module.exports = {
    getAllBranch,
    getBranchById,
    createBranch,
    updateBranch,
    deleteBranch: _deleteBranch,
    getBranch,
    assignUser,
    removeUserFromBranch,

    deactivateBranch,
    reactivateBranch
};

async function getAllBranch() {
    return await db.Branch.findAll();
}
async function getBranchById(id) {
    const branch = await db.Branch.findByPk(id, {
        include: [{
            model: db.User,
            as: 'users',  // This alias matches the 'as' you defined in the association
            attributes: ['id', 'firstName', 'lastName', 'email', 'role']  // Select specific attributes if needed
        }]
    });
    if (!branch) throw 'Branch not found';
    return branch;
}
async function createBranch(params) {
    const branch = new db.Branch(params);
    await branch.save();
}
async function updateBranch(id, params) {
    const branch = await getBranchById(id);
    Object.assign(branch, params);
    await branch.save();
}
async function _deleteBranch(id) {
    const branch = await getBranchById(id);
    branch.status = 'deleted'; // Soft delete by updating status
    await branch.save();
}
async function getBranch(id) {
    const branch = await db.Branch.findByPk(id);
    if (!branch) throw 'Branch2 not found';
    return branch;
}
async function assignUser(branchId, userId) {
    const branch = await getBranchById(branchId);
    const user = await db.User.findByPk(userId);
    // if (!user) throw 'User not found';
    
    // branch.setUser(user); // assuming you have an association between Branch and User
    // await branch.save();
    if (!branch) throw 'Branch3 not found';
    if (!user) throw 'User not found';
    
    // Set the branch for the user
    //await user.setBranch(branch); // Use setBranch to assign the branch to the user

    if (user.role !== Role.Manager) {
        throw 'Only managers can be assigned to a branch';
    }

    user.branchId = branch.id;

    await user.save(); // Save the changes to the user
}
async function removeUserFromBranch(branchId, userId) {
    // Find the user by userId and ensure they belong to the specified branch
    const user = await db.User.findOne({ where: { id: userId, branchId: branchId } });
    if (!user) throw 'User not found or not assigned to this branch';

    // Set the user's branchId to null to remove them from the branch
    user.branchId = null;
    await user.save();

    return { message: 'User removed from branch' };
}
//====================================================================================================
async function deactivateBranch(id) {
    const branch = await getBranchById(id);
    if (!branch) throw 'User not found';

    // Check if the user is already deactivated
    if (branch.status === 'deactivated') throw 'Branch is already deactivated';

    // Set status to 'deactivated' and save
    branch.status = 'deactivated';
    await branch.save();
}
async function reactivateBranch(id) {
    const branch = await getBranchById(id);
    if (!branch) throw 'User not found';

    // Check if the user is already active
    if (branch.status === 'active') throw 'Branch is already active';

    // Set status to 'active' and save
    branch.status = 'active';
    await branch.save();
}