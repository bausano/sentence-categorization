defmodule SencompWeb.HomeController do
  use SencompWeb, :controller
  alias Sencomp.Post
  alias Sencomp.Repo

  def index(conn, _) do
    render(conn, "index.html")
  end
end
