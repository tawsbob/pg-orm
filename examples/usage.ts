// Example of using PG-ORM in a TypeScript application

import { createClient } from '@pg-orm/client';
import { PostGIS, RowLevelSecurity } from '@pg-orm/extensions';

// Import types generated from schema
import { User, Post, UserRole } from './generated/types';

// Create database client
const db = createClient({
  connectionString: process.env.DATABASE_URL,
  extensions: [
    new PostGIS(),
    new RowLevelSecurity()
  ]
});

async function main() {
  // Create a new user with a profile and posts
  const user = await db.user.create({
    data: {
      email: 'john@example.com',
      name: 'John Doe',
      role: UserRole.USER,
      profile: {
        create: {
          bio: 'Software developer with 5 years experience',
          location: {
            // Using PostGIS extension for geographic point
            type: 'Point',
            coordinates: [-122.431297, 37.773972],
            srid: 4326
          }
        }
      },
      posts: {
        create: [
          {
            title: 'Getting started with PG-ORM',
            content: 'PG-ORM is a PostgreSQL-focused ORM...',
            published: true,
            tags: {
              connectOrCreate: [
                {
                  where: { name: 'postgresql' },
                  create: { name: 'postgresql' }
                },
                {
                  where: { name: 'orm' },
                  create: { name: 'orm' }
                }
              ]
            }
          }
        ]
      }
    }
  });

  console.log('Created user:', user.id);

  // Find users with complex filtering
  const users = await db.user.findMany({
    where: {
      OR: [
        { email: { contains: 'example.com' } },
        { 
          posts: {
            some: {
              title: { contains: 'PG-ORM' },
              published: true
            }
          }
        }
      ],
      NOT: {
        role: UserRole.ADMIN
      }
    },
    include: {
      profile: true,
      posts: {
        where: { published: true },
        orderBy: { createdAt: 'desc' },
        include: {
          tags: true
        }
      }
    },
    orderBy: { createdAt: 'desc' },
    take: 10
  });

  console.log(`Found ${users.length} users`);

  // Execute raw SQL with PostgreSQL-specific features
  const popularTags = await db.$queryRaw<Array<{ name: string, count: number }>>`
    SELECT t.name, COUNT(p.id) as count
    FROM "Tag" t
    JOIN "_PostToTag" pt ON t.id = pt."B"
    JOIN "Post" p ON p.id = pt."A"
    WHERE p.published = true
    GROUP BY t.name
    ORDER BY count DESC
    LIMIT 5
  `;

  console.log('Popular tags:', popularTags);

  // Using PostgreSQL full-text search
  const searchResults = await db.post.findMany({
    where: {
      OR: [
        {
          title: {
            search: 'PostgreSQL & ORM'
          }
        },
        {
          content: {
            search: 'PostgreSQL & ORM'
          }
        }
      ],
      published: true
    },
    orderBy: {
      _relevance: {
        fields: ['title', 'content'],
        search: 'PostgreSQL & ORM',
        sort: 'desc'
      }
    },
    take: 10
  });

  console.log(`Found ${searchResults.length} search results`);

  // Using transactions
  try {
    const [updatedUser, newPost] = await db.$transaction(async (tx) => {
      // Update user
      const user = await tx.user.update({
        where: { email: 'john@example.com' },
        data: {
          name: 'John Smith'
        }
      });

      // Create new post
      const post = await tx.post.create({
        data: {
          title: 'Advanced PG-ORM Features',
          content: 'Exploring advanced features of PG-ORM...',
          published: false,
          authorId: user.id,
          tags: {
            connect: [{ name: 'postgresql' }]
          }
        }
      });

      return [user, post];
    });

    console.log('Transaction successful:', updatedUser.name, newPost.id);
  } catch (error) {
    console.error('Transaction failed:', error);
  }

  // Using row-level security context
  await db.$setContext('app.user_id', user.id);
  
  // Now all queries will respect RLS policies
  const myPosts = await db.post.findMany({
    where: {
      authorId: user.id
    }
  });

  console.log(`Found ${myPosts.length} posts for current user`);

  // Using geospatial queries with PostGIS
  const nearbyUsers = await db.profile.findMany({
    where: {
      location: {
        near: {
          latitude: 37.773972,
          longitude: -122.431297,
          distance: 10000 // 10km radius
        }
      }
    },
    include: {
      user: true
    }
  });

  console.log(`Found ${nearbyUsers.length} users nearby`);

  // Close the client when done
  await db.$disconnect();
}

main().catch(console.error); 