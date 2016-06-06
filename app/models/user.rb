class User < ActiveRecord::Base

  attr_reader :password

  after_initialize :ensure_session_token

  validates :email_address, :password_digest, :session_token, presence: true
  validates :password, length: {minimum: 6, allow_nil: true}
  validates :session_token, uniqueness: true

  has_attached_file :profile_pic, default_url: "Profile_Pictures_For_Facebook_02.jpg"
  validates_attachment_content_type :profile_pic, content_type: /\Aimage\/.*\Z/

  has_many :friender_friendships,
    -> { where accepted: true},
    class_name: "Friendship",
    foreign_key: :friender_id,
    primary_key: :id

  has_many :friended_friendships,
    -> { where accepted: true},
    class_name: "Friendship",
    foreign_key: :friended_id,
    primary_key: :id

  has_many :friender_friends,
    through: :friender_friendships,
    source: :friended_user

  has_many :friended_friends,
    through: :friended_friendships,
    source: :friender_user




  def self.find_by_credentials(email_address, password)
    user = User.find_by_email_address(email_address)
    user.try(:is_password?, password) ? user : nil
  end

  def self.generate_session_token
    SecureRandom::urlsafe_base64(16)
  end

  def is_password?(password)
    BCrypt::Password.new(self.password_digest).is_password?(password)
  end

  def password=(password)
    self.password_digest = BCrypt::Password.create(password)
  end

  def reset_session_token!
    self.session_token = self.class.generate_session_token
    self.save!
    self.session_token
  end

  private

  def ensure_session_token
    self.session_token ||= self.class.generate_session_token
  end
end
