package com.zendrive.api;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertTrue;

public class TestUtils {
	/**
	 * Asserts that the given list is contained in the matrix of lists.
	 *
	 * @param givenList The list to check for containment.
	 * @param matrix    The matrix (list of lists) to search within.
	 * @param <T>       The type of elements in the lists.
	 * @throws AssertionError if the given list is not contained in the matrix.
	 */
	public static <T> void assertListContainedInMatrix(List<T> givenList, List<List<T>> matrix) {
		// Check if the given list is contained in the matrix
		Optional<List<T>> matchingSubList = matrix.stream()
																							.filter(subList -> subList.equals(givenList))
																							.findFirst();

		// If no matching sublist is found, throw an AssertionError with detailed message
		if (matchingSubList.isEmpty()) {
			throw new AssertionError(generateErrorMessage(givenList, matrix));
		}
	}

	/**
	 * Generates a detailed error message.
	 *
	 * @param givenList The list that was expected to be found.
	 * @param matrix    The matrix in which the list was expected.
	 * @param <T>       The type of elements in the lists.
	 * @return A detailed error message.
	 */
	private static <T> String generateErrorMessage(List<T> givenList, List<List<T>> matrix) {
		StringBuilder sb = new StringBuilder();
		sb.append("The given list was not found in the matrix.\n");
		sb.append("Expected List: ").append(givenList).append("\n");
		sb.append("Matrix Contents:\n");

		for (List<T> subList : matrix) {
			sb.append(" - ").append(subList).append("\n");
		}

		return sb.toString();
	}
}
