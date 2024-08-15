import { ComponentProps } from 'react'
import { Settings } from 'lucide-react'
import { Button, Dialog, Flex, IconButton, Text } from '@radix-ui/themes'
import ThemeToggleButton from './theme-toggle-button'

export default function OpenSettingsButton({
  className,
  iconSize
}: ComponentProps<'button'> & { iconSize: number }) {
  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <IconButton
          className={className}
        >
          <Settings size={iconSize} />
        </IconButton>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Title>Settings</Dialog.Title>
        <Flex align={'center'}>
          <Text className='mr-1'>Theme:</Text>
          <ThemeToggleButton iconSize={20} />
        </Flex>

        <Flex gap="3" justify="end">
          <Dialog.Close>
            <Button variant="soft" color="gray">
              Close
            </Button>
          </Dialog.Close>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  )
}
