#!/bin/bash

# Add environment variables to Vercel
echo "Adding NEXT_PUBLIC_SUPABASE_URL..."
echo "https://pwvvanowugjfotqqsspe.supabase.co" | vercel env add NEXT_PUBLIC_SUPABASE_URL production

echo "Adding NEXT_PUBLIC_SUPABASE_ANON_KEY..."
echo "$NEXT_PUBLIC_SUPABASE_ANON_KEY" | vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production

echo "Adding SUPABASE_SERVICE_ROLE_KEY..."
echo "$SUPABASE_SERVICE_ROLE_KEY" | vercel env add SUPABASE_SERVICE_ROLE_KEY production

echo "Adding OPENAI_API_KEY..."
echo "$OPENAI_API_KEY" | vercel env add OPENAI_API_KEY production

echo "Environment variables added successfully!"
