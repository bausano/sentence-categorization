defmodule Sencomp.Repo do
  use Ecto.Repo,
    otp_app: :sencomp,
    adapter: Ecto.Adapters.Postgres
end
