import { api } from '@/shared/services/api'; // Assuming apiService is in src/services

/**
 * Submits the selected branch information for the user.
 * @param {object} branchData - The branch selection data.
 * @param {string} branchData.home_branch - The selected branch name.
 * @param {string} branchData.signup_id - The signup ID of the user.
 * @param {string} branchData.best_contact_time - The preferred contact time.
 * @param {string} branchData.preferred_contact_method - The preferred contact method.
 * @returns {Promise<object>} The response from the API.
 * @throws {Error} If the API call fails.
 */
export const submitBranchSelection = async (branchData) => {
  try {
    const response = await api.put('/signups/home-branch', branchData);
    return response;
  } catch (error) {
    console.error('Error in submitBranchSelection:', error.response?.data || error.message);
    throw error; // Re-throw to be handled by the caller (e.g., Pinia store)
  }
}; 