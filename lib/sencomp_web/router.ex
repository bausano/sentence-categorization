defmodule SencompWeb.Router do
  use SencompWeb, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/", SencompWeb do
    pipe_through :browser

    get "/", HomeController, :index
  end

  # scope "/api", SencompWeb do
  #   pipe_through :api
  # end
end
