import MessageModel from '../../../src/features/groups/models/message';
import { createTestGroup, createTestUser } from '../../helpers/testUtils';

describe('Message Model', () => {
  let user: any;
  let group: any;

  beforeEach(async () => {
    user = await createTestUser();
    group = await createTestGroup(user._id);
  });

  describe('Message Creation', () => {
    it('should create a message with valid data', async () => {
      const message = await MessageModel.create({
        content: 'Test message',
        sender: user._id,
        group: group._id,
      });

      expect(message.content).toBe('Test message');
      expect(message.sender.toString()).toBe(user._id.toString());
      expect(message.group.toString()).toBe(group._id.toString());
      expect(message.createdAt).toBeDefined();
    });

    it('should require content', async () => {
      await expect(
        MessageModel.create({
          sender: user._id,
          group: group._id,
        }),
      ).rejects.toThrow();
    });
  });

  describe('Message Queries', () => {
    beforeEach(async () => {
      // Create multiple messages
      await MessageModel.create([
        {
          content: 'Message 1',
          sender: user._id,
          group: group._id,
          createdAt: new Date(Date.now() - 2000),
        },
        {
          content: 'Message 2',
          sender: user._id,
          group: group._id,
          createdAt: new Date(Date.now() - 1000),
        },
        {
          content: 'Message 3',
          sender: user._id,
          group: group._id,
        },
      ]);
    });

    it('should find messages by group in correct order', async () => {
      const messages = await MessageModel.findByGroup(group._id, 3);
      expect(messages).toHaveLength(3);
      expect(messages[0].content).toBe('Message 3'); // Most recent first
      expect(messages[2].content).toBe('Message 1'); // Oldest last
    });

    it('should respect limit parameter', async () => {
      const messages = await MessageModel.findByGroup(group._id, 2);
      expect(messages).toHaveLength(2);
    });
  });
});
