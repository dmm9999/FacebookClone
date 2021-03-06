class Api::UsersController < ApplicationController

  def index
    @users = User.where.not(id: current_user.id).limit(5).order("RANDOM()")
    render 'api/users/index'
  end

  def create
    @user = User.new(user_params)
    if @user.save
      login(@user)
      render "api/users/show"
    else
      @errors = @user.errors
      render json: @errors, status: 422
      # render "api/shared/error", status: 422
    end
  end

  def show
    @user = User.find(params[:id])
    render "api/users/show"

  end

  def update

    @user = current_user

    if @user.update(user_params)
      render "api/users/show"
    else
      @errors = @user.errors
      render json: @errors, status: 422
    end
  end

  def friends
    @user = User.find(params[:id])
    @friends = @user.friends
  end

  def create_friendship
    @friendship = Friendship.create(friender_id: current_user.id, friended_id: params[:friended_id].to_i)
    render json: @friendship
  end

  def delete_friendship
    @friendship = Friendship.find_by_ids(current_user.id, params[:profileId].to_i)
    @friendship.delete
    render json: @friendship
  end

  def feed
    @posts = current_user.feed
    render "api/posts/index"
  end

  private

  def user_params
    params.require(:user).permit(:id, :email_address, :password, :description, :hometown, :school, :work, :current_city, :phone_number, :birthday, :profile_pic, :coverpic, :first_name, :last_name)
  end

end
