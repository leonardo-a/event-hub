import { type Either, left, right } from './either'

function doSomething(shouldSuccess: boolean): Either<string, number> {
  if (shouldSuccess) {
    return right(10)
  } 
  
  return left('error')
}

test('success result', () => {
  const successResult = doSomething(true)

  expect(successResult.isRight()).toEqual(true)
  expect(successResult.isLeft()).toEqual(false)
})

test('error result', () => {
  const successResult = doSomething(false)

  expect(successResult.isLeft()).toEqual(true)
  expect(successResult.isRight()).toEqual(false)
})
