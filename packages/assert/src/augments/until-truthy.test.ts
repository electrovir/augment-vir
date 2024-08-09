describe(waitUntilTruthy.name, () => {
    it('should resolve once a condition is true', async () => {
        let condition = false;
        await waitUntilTruthy(() => {
            if (condition) {
                return true;
            } else {
                condition = true;
                return false;
            }
        });
        assert.isTrue(condition);
    });

    it('should wait until the condition is true', async () => {
        let condition = false;
        setTimeout(() => {
            condition = true;
        }, 1000);
        assert.isFalse(condition);
        await waitUntilTruthy(() => {
            return condition;
        });
        assert.isTrue(condition);
    });

    it('should handle errors', async () => {
        const errorMessage = randomString();

        await assertThrows(
            waitUntilTruthy(
                () => {
                    throw new Error(errorMessage);
                },
                '',
                {
                    timeout: {milliseconds: 100},
                },
            ),
            {
                matchMessage: errorMessage,
            },
        );
    });

    it('should use timeoutMessage', async () => {
        const timeoutMessage = randomString();

        await assertThrows(
            waitUntilTruthy(
                () => {
                    return false;
                },
                timeoutMessage,
                {
                    timeout: {milliseconds: 100},
                },
            ),
            {
                matchMessage: timeoutMessage,
            },
        );
    });
});
