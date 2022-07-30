class AddColumnsToMovies < ActiveRecord::Migration[7.0]
  def change
    add_column :movies, :day, :integer
    add_column :movies, :contributor, :string
    add_column :movies, :publish, :boolean, default: false
    add_column :movies, :movie_uniq_id, :bigint
    add_index :movies, :movie_uniq_id, unique: true
  end
end
