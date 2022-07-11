class Movie < ApplicationRecord
  has_one_attached :hardest
  has_one_attached :harder
  has_one_attached :hard
  has_one_attached :easy
  has_one_attached :easiest
end
