const { query } = require("../database")

class Profile {
  constructor(row) {
    this.id = row.id
    this.profileName = row.profile_name 
    this.isKid = row.is_kid 
    this.avatarId = row.avatar_id
    this.profilePin = row.profile_pin 
    this.userId = row.user_id 
    this.createdAt = row.created_at 
    this.updatedAt = row.updated_at 
    this.avatarUrl = row.avatar_link
  }

  static async allProfiles(userId) {
    const response = await query(`
      SELECT 
        profiles.id,
        profiles.profile_name,
        profiles.is_kid,
        profiles.avatar_id,
        profiles.profile_pin,
        profiles.user_id,
        profiles.created_at,
        profiles.updated_at,
        avatars.id AS avatar_id,
        avatars.avatar_link
      FROM profiles 
      JOIN avatars ON profiles.avatar_id = avatars.id
      WHERE profiles.user_id = $1`, [userId])

    return response.rows.map((row) => new Profile(row))
  }

  static async profileById(profileId) {
    const response = await query(`
      SELECT 
        profiles.id,
        profiles.profile_name,
        profiles.is_kid,
        profiles.avatar_id,
        profiles.profile_pin,
        profiles.user_id,
        profiles.created_at,
        profiles.updated_at,
        avatars.id AS avatar_id,
        avatars.avatar_link
      FROM profiles
      JOIN avatars ON profiles.avatar_id = avatars.id
      WHERE profiles.id = $1`, [profileId])

      return response.rows[0]
  }

  static async createProfile(profileId, userId, profileName, isKid = false, profilePin = null) {
    const avatarsArr = await query(`SELECT * FROM avatars`)
    const avatarData = avatarsArr.rows

    const randomAvatarId = Math.floor(Math.random() * avatarData.length)

    const response = await query(`
      INSERT INTO profiles (id, user_id, profile_name, is_kid, profile_pin, avatar_id)
      VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`, 
      [profileId, userId, profileName, isKid, profilePin, randomAvatarId])

    return new Profile(response.rows[0])
  }

  static async updateProfile(profileId, updatedData) {
    if (updatedData.profileName) {
      await query(`
        UPDATE profiles 
        SET profile_name = $1,
        updated_at = CURRENT_TIMESTAMP
        WHERE id = $2`,
        [updatedData.profileName, profileId]
      )
    }

    if (updatedData.isKid !== undefined) {
      await query(`
        UPDATE profiles 
        SET is_kid = $1,
        updated_at = CURRENT_TIMESTAMP
        WHERE id = $2`,
        [updatedData.isKid, profileId]
      )
    }

    if (updatedData.profilePin) {
      await query(`
        UPDATE profiles 
        SET profile_pin = $1,
        updated_at = CURRENT_TIMESTAMP
        WHERE id = $2`,
        [updatedData.profilePin, profileId]
      )
    }
  }

  static async deleteProfile(profileId) {
    await query(`DELETE FROM profiles WHERE id = $1`, [profileId])
  }
}

module.exports = Profile