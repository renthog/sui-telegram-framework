provider "aws" {
  region = "us-west-2"  # Change this to your preferred AWS region
}

resource "aws_s3_bucket" "s3_bucket" {
  bucket = var.bucket_name
  acl    = "private"

  versioning {
    enabled = true
  }
}

data "aws_iam_policy_document" "s3_role_trust" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["ec2.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "s3_access_role" {
  name               = "S3AccessRole"
  assume_role_policy = data.aws_iam_policy_document.s3_role_trust.json
}

data "aws_iam_policy_document" "s3_access_policy_doc" {
  statement {
    actions = [
      "s3:GetObject",
      "s3:PutObject",
      "s3:DeleteObject"
    ]

    effect = "Allow"

    resources = [
      "${aws_s3_bucket.s3_bucket.arn}/*"
    ]
  }
}

resource "aws_iam_policy" "s3_access_policy" {
  name        = "S3AccessPolicy"
  description = "Policy to access the S3 bucket"
  policy      = data.aws_iam_policy_document.s3_access_policy_doc.json
}

resource "aws_iam_role_policy_attachment" "s3_policy_attachment" {
  role       = aws_iam_role.s3_access_role.name
  policy_arn = aws_iam_policy.s3_access_policy.arn
}