import { useState } from 'react';

interface Props {
	onModalCloseCallBack?: () => void;
}

export const useModal = ({ onModalCloseCallBack }: Props) => {
	const [open, setOpen] = useState(false);

	const onModalClose = () => {
		onModalCloseCallBack?.();
		setOpen(false);
	};

	return { open, setOpen, onModalClose };
};
