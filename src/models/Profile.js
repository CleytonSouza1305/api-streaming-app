const { query } = require("../database")

class Profile {
  constructor(row) {
    this.Id = row.id
    this.profileName = row.profile_name 
    this.isKid = row.is_kid 
    this. avatarUrl = row.avatar_url
    this.profilePin = row.profile_pin 
    this.userId = row.user_id 
    this.createdAt = row.created_at 
    this.updatedAt = row.updated_at 
  }

  static async allProfiles(userId) {
    const response = await query(`
      SELECT * FROM profiles WHERE user_id = $1`, [userId])

    return response
  }

  static async profileById(profileId) {
    const response = await query(`
      SELECT * FROM profiles WHERE id = $1`, [profileId])

      return response
  }
}

module.exports = Profile