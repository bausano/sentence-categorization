defmodule Sencomp.ReleaseTasks do
  def migrate do
    {:ok, _} = Application.ensure_all_started(:sencomp)

    path = Application.app_dir(:sencomp, "priv/repo/migrations")

    Ecto.Migrator.run(Sencomp.Repo, path, :up, all: true)
  end
end
